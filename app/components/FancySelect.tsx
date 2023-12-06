import React from "react";
import Select, { components } from "react-select";

const { Option, SingleValue } = components;

const SelectedImage = (props) => (
  <SingleValue {...props}>
    <img
      src={
        props.data.image != null
          ? props.data.image
          : "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=6&m=1223671392&s=170667a&w=0&h=zP3l7WJinOFaGb2i1F4g8IS2ylw0FlIaa6x3tP9sebU="
      }
      alt={props?.data?.image}
      style={{
        height: 30,
        width: 30,
        borderRadius: 15,
        marginRight: 10,
        objectFit: "cover",
      }}
    />
    {props.data.label}
  </SingleValue>
);

const ImageOption = (props) => (
  <Option {...props}>
    <img
      src={
        props.data.image != null
          ? props.data.image
          : "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=6&m=1223671392&s=170667a&w=0&h=zP3l7WJinOFaGb2i1F4g8IS2ylw0FlIaa6x3tP9sebU="
      }
      alt={props?.data?.image}
      style={{
        height: 30,
        width: 30,
        borderRadius: 15,
        marginRight: 10,
        objectFit: "cover",
      }}
    />
    {props.data.label}
  </Option>
);

const customStyles = {
  option: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: 8,
    paddingTop: 2,
    paddingBottom: 2,
    marginTop: 3,
    border: "1px solid rgb(107 114 128)",
  }),
};

function FancySelect({
  name = "",
  isMulti = false,
  defaultValue,
  value,
  onChange,
  options,
}: {
  name: string;
  isMulti: boolean;
  defaultValue: string;
  value: string;
  onChange: any;
  options: { value: string; label: string }[];
}) {
  return (
    <Select
      name={name}
      isMulti={isMulti}
      isSearchable={true}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      styles={customStyles}
      components={{
        Option: ImageOption,
        SingleValue: SelectedImage,
      }}
      options={options}
      classNames={{
        control: (state) =>
          state.isFocused ? "border-red-600" : "border-grey-300",
        // singleValue: (state) => (state.isMulti ? "" : ""),
      }}
      className="rounded-xl border-slate-500 bg-white shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 focus:ring-opacity-50 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400 dark:focus:border-purple-500 dark:focus:ring-purple-500"
    />
  );
}

export default FancySelect;
