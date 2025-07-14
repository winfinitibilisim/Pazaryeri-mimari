import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const UKFlag: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 60 30">
        <clipPath id="a">
            <path d="M0 0v30h60V0z"/>
        </clipPath>
        <path d="M0 0v30h60V0z" fill="#012169"/>
        <path d="M0 0l60 30m-60 0L60 0" stroke="#fff" strokeWidth="6" clipPath="url(#a)"/>
        <path d="M0 0l60 30m-60 0L60 0" stroke="#C8102E" strokeWidth="4" clipPath="url(#a)"/>
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </SvgIcon>
);

export default UKFlag;
