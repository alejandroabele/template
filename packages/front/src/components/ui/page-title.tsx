import React from 'react';

interface PageTitleProps {
    title: string;
}

export function PageTitle({ title }: PageTitleProps) {
    return <h2 className="text-xl font-semibold pb-4 w-full" >{title}</h2>;
}
