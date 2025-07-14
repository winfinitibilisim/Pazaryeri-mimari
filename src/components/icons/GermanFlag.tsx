import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const GermanFlag: React.FC<SvgIconProps> = (props) => (
    <SvgIcon {...props} viewBox="0 0 5 3">
        <path d="M0 0h5v3H0z"/>
        <path fill="#D00" d="M0 1h5v2H0z"/>
        <path fill="#FFCE00" d="M0 2h5v1H0z"/>
    </SvgIcon>
);

export default GermanFlag;
