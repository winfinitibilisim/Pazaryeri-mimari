import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const TurkeyFlag: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 800 400">
        <path fill="#e30a17" d="M0 0h800v400H0z"/>
        <path fill="#fff" d="M450 200a100 100 0 1 0 0-1a50 50 0 1 1 0 1"/>
        <path fill="#fff" d="M460 200l-75-22.5 28.5 71.5v-98l-28.5 71.5z"/>
    </SvgIcon>
);

export default TurkeyFlag;
