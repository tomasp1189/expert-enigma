import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useContext, useState } from "react";
import { Store } from "../providers/Store";
import { MintButton } from "./MintButton";
import Image from "mui-image";

export const MintModal : React.FC = () => {
    const [mintingData, setMintingData] = useState(null);
    const [open, setOpen] = useState(false);
    const { userStore } = useContext(Store);
    
    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Mint NFT
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Mint NFT</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Buy a Sloth NFT for 0.01 ETH
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