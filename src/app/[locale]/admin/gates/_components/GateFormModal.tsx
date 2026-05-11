import { Modal, Stack, Button, Group, TextInput, Select, JsonInput, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Branch } from '../hooks/useGateManagement';

interface GateFormModalProps {
  opened: boolean;
  onClose: () => void;
  submitting: boolean;
  form: any;
  onSubmit: (values: any) => void;
  branches: Branch[];
  t: (key: string) => string;
}

  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>{t('Gate.addNew')}</Text>}
      centered
      size="lg"
      fullScreen={isMobile}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <Stack gap="sm">
            <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
              <TextInput 
                label={t('Gate.code')} 
                placeholder="เช่น GATE-01" 
                required 
                {...form.getInputProps('gateCode')} 
                w={isMobile ? '100%' : undefined}
              />
              <Select
                label={t('Gate.selectBranch')}
                placeholder={t('Gate.selectBranchPlaceholder')}
                data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
                required
                {...form.getInputProps('branchId')}
                w={isMobile ? '100%' : undefined}
              />
            </Group>
          </Stack>
          
          <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
            <TextInput label={t('Common.nameTh')} required {...form.getInputProps('nameTh')} w={isMobile ? '100%' : undefined} />
            <TextInput label={t('Common.nameEn')} required {...form.getInputProps('nameEn')} w={isMobile ? '100%' : undefined} />
          </Group>
          
          <TextInput label={t('Common.nameZh')} required {...form.getInputProps('nameZh')} />
          
          <Group grow wrap={isMobile ? 'wrap' : 'nowrap'}>
            <Select
              label={t('Gate.direction')}
              data={[
                { value: 'IN', label: 'IN' },
                { value: 'OUT', label: 'OUT' },
                { value: 'BIDIRECTIONAL', label: 'BIDIRECTIONAL' },
              ]}
              {...form.getInputProps('direction')}
              w={isMobile ? '100%' : undefined}
            />
            <Select
              label={t('Common.status')}
              data={[
                { value: 'ACTIVE', label: 'ACTIVE' },
                { value: 'MAINTENANCE', label: 'MAINTENANCE' },
                { value: 'DISABLED', label: 'DISABLED' },
              ]}
              {...form.getInputProps('status')}
              w={isMobile ? '100%' : undefined}
            />
          </Group>

          <JsonInput
            label="Metadata (JSON)"
            placeholder='{"floor": 1, "zone": "A"}'
            validationError="Invalid JSON"
            formatOnBlur
            autosize
            minRows={2}
            {...form.getInputProps('metadata')}
          />

          <Group justify="flex-end" mt="md" grow={isMobile}>
            <Button variant="subtle" onClick={onClose}>
              {t('Common.cancel')}
            </Button>
            <Button type="submit" color="navy" loading={submitting}>
              {t('Common.save')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
