import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const PromotionsPage = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Promosyonlar</Typography>
            <Card>
                <CardContent>
                    <Typography variant="body1">
                        Soldaki menüden promosyon ve indirim seçeneklerini yönetebilirsiniz.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PromotionsPage;
