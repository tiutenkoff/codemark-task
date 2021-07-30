import React from 'react'

interface PropsButton {
    title: string,
    color: string,
    onDownload?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    onGroup?: () => void,
}

export const Button: React.FC<PropsButton> = ({ title, color, onDownload, onGroup }) => {
    return (
        <button onClick={onDownload || onGroup} type="button" className={`form__item btn btn-${color}`}>{ title }</button>
    )
}
