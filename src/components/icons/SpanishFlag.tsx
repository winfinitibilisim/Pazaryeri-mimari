import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const SpanishFlag: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 600 400">
        <path fill="#c60b1e" d="M0 0h600v400H0z"/>
        <path fill="#ffc400" d="M0 100h600v200H0z"/>
    </SvgIcon>
);

export default SpanishFlag;
