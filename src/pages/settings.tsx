import { Button, Form,  InputNumber,  Switch, Typography } from 'antd';
import { useCallback } from 'react';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';
import { useDataContext } from '@/context';

import styles from '@/styles/SettingsPage.module.css';
import { Settings } from '@/models';

const { Title } = Typography;

export default function SettingsPage({ data }: PageProps) {
  const [form] = Form.useForm();
  const { updateData } = useDataContext();
  const { settings } = data;

  const handleSubmit = useCallback((formData: Partial<Settings>) => {
    const submitData = {
      settings: {
        id: settings.id,
        ...formData
      }
    };
    updateData(submitData);
  }, [settings, updateData]);

  const shouldAutosave = Form.useWatch('shouldAutosave', form);
  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Title style={{ textAlign: 'center' }}>Settings</Title>
        <Form
          form={form}
          name="settings-form"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="shouldAutosave"
            label="Should autosave?"
            initialValue={settings.shouldAutosave}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="autosaveInterval"
            label="Autosave seconds (0 = immediately)"
            rules={[({ getFieldValue }) => ({
              validator(_, value) {
                return value >= 0 || !getFieldValue('shouldAutosave') ? Promise.resolve() : Promise.reject(new Error('Please enter seconds'));
              },
            })]}
            initialValue={settings.autosaveInterval}
            hidden={shouldAutosave === false}
          >
            <InputNumber min={0} controls={false} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
