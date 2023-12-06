import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ExcelMapper = ({ columns, onMapColumns }) => {
  const columnNames = Object.keys(columns); // Extract keys from the first object

  const [mappedColumns, setMappedColumns] = useState({});
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    setMappedColumns({});

    const modelFields = [
      "name",
      "description",
      "quantity",
      "price",
      "costPrice",
    ];
    setAvailableFields(modelFields);
  }, [columns]);

  const handleMapColumn = (excelColumn, mongooseField) => {
    console.log(excelColumn, "->", mongooseField);

    setMappedColumns({
      ...mappedColumns,
      [excelColumn]: mongooseField,
    });
  };

  const handleSaveMapping = () => {
    onMapColumns(mappedColumns);
  };

  return (
    <div className="bg-white shadow-md p-2 rounded-xl gap-3 flex flex-col">
      <table className="w-full text-left text-slate-500 dark:text-slate-400">
        <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
          <tr>
            <th scope="col" className="px-3 py-3">
              Excel Column
            </th>
            <th scope="col" className="px-3 py-3">
              Model Field
            </th>
          </tr>
        </thead>
        <tbody>
          {columnNames.map((excelColumn, index) => (
            <tr
              key={index}
              className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
            >
              <td className="px-3 py-3 font-semibold">{excelColumn}</td>
              <td className="px-3 py-3">
                <Select onValueChange={(e) => handleMapColumn(excelColumn, e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select model column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem>Select</SelectItem>
                      {availableFields.map((field, index) => (
                        <SelectItem key={index} value={field}>
                          {field}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button onClick={handleSaveMapping}>Display Result</Button>
    </div>
  );
};

export default ExcelMapper;
