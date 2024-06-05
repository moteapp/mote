import { HTMLAttributes, forwardRef, useState } from 'react';
import { ITooltipProps, Tooltip } from '../tooltip';
import { useIsMounted } from 'mote/app/hooks/useIsMounted';

export type IActionButtonProps = HTMLAttributes<HTMLButtonElement> & {
    /** Show the button in a disabled state */
    disabled?: boolean;
    /** Hide the button entirely if action is not applicable */
    hideOnActionDisabled?: boolean;
    /** If tooltip props are provided the button will be wrapped in a tooltip */
    tooltip?: Omit<ITooltipProps, "children">;
    action?: () => Promise<void> | void;
    context?: any;
}

export const ActionButton = forwardRef<HTMLButtonElement, IActionButtonProps>(
    function _ActionButton(
        { action, tooltip, hideOnActionDisabled, disabled, ...rest }: IActionButtonProps,
        ref: React.Ref<HTMLButtonElement>
    ) {

    const isMounted = useIsMounted();
    const [executing, setExecuting] = useState(false);

    if (!action) {
        return <button {...rest} ref={ref} />;
    }

    const handleClick = async () => {
        if (disabled || executing) {
            return;
        }

        setExecuting(true);

        try {
            await action();
        } finally {
            setExecuting(false);
        }
    }

    const button = (
        <button
            onClick={handleClick}
        />
    );

    if (tooltip) {
        return <Tooltip {...tooltip}>{button}</Tooltip>;
    }

    return button;
});