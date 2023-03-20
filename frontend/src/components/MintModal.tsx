import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState } from "react";
import { MintButton } from "./MintButton";

export const MintModal : React.FC = () => {
    const [open, setOpen] = useState(false);
    
    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Mint Sloth
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Mint Sloth</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Get a Sloth NFT for 0.01 ETH
            </DialogContentText>
            <img src="sloths.png" width='100%' height='100%'/>
    
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <MintButton />
            </DialogActions>
        </Dialog>
        </>
    );
    };