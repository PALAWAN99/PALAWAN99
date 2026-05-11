import { Center, Stack, Title, Text, Button, Box } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'We encountered an error while loading the data.',
  onRetry 
}: ErrorStateProps) {
  return (
    <Center style={{ minHeight: '40vh' }}>
      <Stack align="center" gap="md" ta="center">
        <Box c="red.6">
          <IconAlertCircle size={48} stroke={1.5} />
        </Box>
        <div>
          <Title order={3}>{title}</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {message}
          </Text>
        </div>
        {onRetry && (
          <Button 
            variant="light" 
            color="skyBlue" 
            leftSection={<IconRefresh size={16} />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Stack>
    </Center>
  );
}
