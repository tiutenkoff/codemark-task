import React from 'react';

interface PropsAlert {
    title: string,
}

export const Alert: React.FC<PropsAlert> = ({  title }) => {
    return (
        <div className="alert alert-primary" role="alert">
            { title }
        </div>
    )
}
