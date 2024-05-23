import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Accordion from '@mui/material/Accordion';
import Iconify from '../iconify';

export const CopyToClipboard = ({ text }: {text: string}) => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Copiar al portapapeles">
        <IconButton onClick={handleCopy}>
        <Iconify icon="iconamoon:copy-bold" />
          
        </IconButton>
      </Tooltip>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Copiado al portapapeles"
      />
    </div>
  );
};