import React from 'react';

interface PropsButton {
    title: string,
    color: string,
    disabled?: boolean,
    onDownload?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onGroup?: () => void,
    isGrouped?: () => void,
}

export const Button: React.FC<PropsButton> = ({ title, color, onDownload, onGroup, disabled, isGrouped }) => {
    return (
        <button disabled={disabled} onClick={onDownload || onGroup  || isGrouped} type="button" className={`form__item btn btn-${color}`}>{ title }</button>
    )
}
