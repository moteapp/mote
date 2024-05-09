import * as React from "react";

import './media/editable.css';

export interface EditableProps {
    tagName?: string;
    placeholder?: string;
    onChange?: (value: string) => void;
    onMutation?: (mutation: IMutation) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    getHtml?: () => string;
}

export interface IMutation {
    newValue: string;
    insertedLine: boolean;
    isComposing: boolean;
}

export class ContentEditable extends React.Component<EditableProps> {
    html: string = '';
    previousHtml: string = '';
    ownNodeIsComposing: boolean = false;

    root: HTMLDivElement | null = null;
    testDiv = document.createElement("div");

    isComposing() {
        return this.ownNodeIsComposing;
    }

    handleChange = (e: React.FormEvent<HTMLDivElement>) => {
        if (this.getText() === '') {
            this.setState({isEmpty: true});
        } else {
            this.setState({isEmpty: false});
        }
        this.props.onChange?.(this.getText());
    }

    getText() {
        return this.root?.textContent || '';
    }

    handleInput = () => {
        this.handleMutation({
            newValue: this.getText(),
            insertedLine: false,
            isComposing: this.isComposing()
        })
    }

    handleMutation = (mutation: IMutation) => {
        this.props.onMutation?.(mutation);
    }

    updateContainer(force: boolean) {
        if (this.root) {
            if (force) {
                this.root.innerHTML = this.html;
            } else {
                if(this.previousHtml !== this.html) {
                    this.previousHtml = this.html;
                    this.testDiv.innerHTML = this.html
                }
                const e = this.root.innerHTML;
                const t = this.testDiv.innerHTML;
                if (e !== t) {
                    this.root.innerHTML = this.html;
                }
            }
        }
    }

    UNSAFE_componentWillMount() {
        this.UNSAFE_willMountOrUpdate(this.props);
    }

    UNSAFE_componentWillUpdate(e: Readonly<EditableProps>) {
        this.UNSAFE_willMountOrUpdate(e);
    }

    UNSAFE_willMountOrUpdate(e: Readonly<EditableProps>) {
        this.html = e.getHtml!();
    }

    didMount() {
        this.updateContainer(true);
    }

    didUpdate() {
        this.updateContainer(false);
    }

    componentDidMount(): void {
        this.didMount();
    }

    componentDidUpdate(prevProps: Readonly<EditableProps>, prevState: Readonly<{}>, snapshot?: any): void {
        this.didUpdate();
    }

    render() {
        const placeholderStyle = Boolean(!this.html) ? {WebkitTextFillColor: 'rgba(55, 53, 47, 0.5)'} : {};
        const style = Object.assign({}, placeholderStyle);

        return React.createElement(this.props.tagName || 'div', {
            ref: (el: HTMLDivElement) => this.root = el,
            className: 'editable',
            contentEditable: true,
            placeholder: this.props.placeholder,
            style: style,
            onInput: this.handleInput,
            onKeyDown: this.props.onKeyDown,
        });
    }
}