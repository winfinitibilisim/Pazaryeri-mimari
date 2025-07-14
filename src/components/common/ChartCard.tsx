import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type ChartType = 'line' | 'bar';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  chartType: ChartType;
  data: ChartData<'line' | 'bar'>;
  options?: ChartOptions<'line' | 'bar'>;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  chartType,
  data,
  options,
  height = 300,
}) => {
  const theme = useTheme();

  // Default chart options
  const defaultOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
        },
        ticks: {
          color: theme.palette.text.secondary,
        },
      },
    },
  };

  // Merge default options with provided options
  const chartOptions = { ...defaultOptions, ...options };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ height: height, position: 'relative' }}>
          {chartType === 'line' ? (
            <Line data={data as ChartData<'line'>} options={chartOptions} />
          ) : (
            <Bar data={data as ChartData<'bar'>} options={chartOptions} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard; 