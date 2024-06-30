export interface IEditableTitleProps {
    title: string;
}

export const EditableTitle = ({
    title
}: IEditableTitleProps) => {

    return (
        <span>
            {title}
        </span>
    )
}