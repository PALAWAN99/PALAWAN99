import { Modal, Group, Button, Text, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  color = 'red',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered size="sm">
      <Stack gap="md">
        <Group align="flex-start" wrap="nowrap">
          <IconAlertTriangle color={`var(--mantine-color-${color}-6)`} size={24} style={{ flexShrink: 0 }} />
          <Text size="sm">{message}</Text>
        </Group>
        
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button color={color} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
