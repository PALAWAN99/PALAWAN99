import { Center, Loader, Stack, Text } from '@mantine/core';

interface LoadingScreenProps {
  message?: string;
  minHeight?: string | number;
}

export function LoadingScreen({ message = 'Loading...', minHeight = '50vh' }: LoadingScreenProps) {
  return (
    <Center style={{ minHeight }}>
      <Stack align="center" gap="sm">
        <Loader size="lg" color="skyBlue" type="bars" />
        <Text size="sm" c="dimmed" fw={500}>
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
