import { DatePicker, Form, Input, InputNumber, Select } from "antd";

const { RangePicker } = DatePicker;

const sz = "middle";

export const parseFormMeta = (
  { name, label, type, paramType, placeholder, min },
  paramConfigForSelect,
) => {
  const parseInnerEle = (type, placeholder) => {
    switch (type) {
      case "input":
        return <Input size={sz} placeholder={placeholder} allowClear={true} />;
      case "inputNumber":
        return <InputNumber size="large" min={min} placeholder={placeholder} />;
      case "textArea":
        return (
          <Input.TextArea
            size={sz}
            placeholder={placeholder}
            allowClear={true}
          />
        );
      case "dateTimeRangePicker":
        return (
          <RangePicker
            size={sz}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            allowClear={true}
          />
        );
      case "dateTimePicker":
        return (
          <DatePicker
            size={sz}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            allowClear={true}
          />
        );
      case "select":
        return (
          <Select
            size={sz}
            placeholder={placeholder}
            options={paramConfigForSelect(paramType)?.map((item) => {
              return {
                value: item.value,
                label: item.label,
              };
            })}
          ></Select>
        );
      default:
        return (
          <Input size="large" placeholder={placeholder} allowClear={true} />
        );
    }
  };
  return (
    <Form.Item name={name} label={label}>
      {parseInnerEle(type, placeholder)}
    </Form.Item>
  );
};
