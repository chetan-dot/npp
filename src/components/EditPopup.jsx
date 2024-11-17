import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { fetchAllWards } from "@/helper/apiservices/fetchUserDetails";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, wardSelection, theme) {
  return {
    fontWeight: wardSelection.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const EditPopup = ({ open, onClose, data, onSave }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState(data || {});
  const [wardSelection, setWardSelection] = useState(formData.wards || []);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"; // Prevent scrolling
      fetchAllWards() // Replace with your actual API endpoint
        .then((response) => {
          setWards(response.totalWards);
        })
        .catch((error) => {
          console.error("Error fetching wards:", error);
        });
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup in case popup is closed
    };
  }, [open]);

  const handleWardChange = (event) => {
    const {
      target: { value },
    } = event;
    setWardSelection(value);
    setFormData({
      ...formData,
      wards: value,
    });
  };

  const handleSave = () => {
    onSave(formData); // Call the save function passed as props
    setWardSelection([]);
    onClose(); // Close the popup
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Assign Ward</h2>

        <div className="mb-4">
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-ward-label">Assign Ward</InputLabel>
            <Select
              labelId="demo-multiple-ward-label"
              id="demo-multiple-ward"
              multiple
              value={wardSelection}
              onChange={handleWardChange}
              input={<OutlinedInput label="Assign Ward" />}
              MenuProps={MenuProps}
            >
              {wards.map((ward) => (
                <MenuItem
                  key={ward.label}
                  value={ward}
                  style={getStyles(ward, wardSelection, theme)}
                >
                  {`Ward - ${ward.label}(${ward.numberOfUser}users)`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
