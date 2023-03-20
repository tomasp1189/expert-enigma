import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, Card, CardMedia, CircularProgress, alpha, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Key, SetStateAction, useContext, useEffect, useState } from "react";
import { SlothNFT } from "../constants/types";
import { useGetNFTsByAddress } from "../hooks/useGetNFTsByAddress";
import { Store } from "../providers/Store";
export const NFTsModal : React.FC = () => {
    const [open, setOpen] = useState(false);
    const { userStore } = useContext(Store);
    const { setSelectedTokenId, setShowDetailsModal, allNFTs, userNFTs, setUserNFTs } = userStore;
    const [loading, setLoading] = useState(true);
    const address = useContext(Store).userStore.address;
    setUserNFTs(useGetNFTsByAddress(address));
    const [viewMode, setViewMode] = useState('all');
    const displayedNFTs = viewMode === 'owned' ? userNFTs : allNFTs;

    useEffect(() => {
        if (displayedNFTs.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [displayedNFTs]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleViewModeChange = (event: any, newViewMode: SetStateAction<string> | null) => {
      if (newViewMode !== null) {
        setViewMode(newViewMode);
      }
    };
    
    return (
        <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            Slothédex
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Slothédex</DialogTitle>
            <DialogContent >
            <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                          <ToggleButton value="all">All NFTs</ToggleButton>
                          <ToggleButton value="owned">Owned NFTs</ToggleButton>
            </ToggleButtonGroup>
{ loading ? (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  ) : displayedNFTs && (
    <Grid container spacing={2} sx={{
      pt: 2,
    }}>
      {displayedNFTs.map((nft: SlothNFT, index: Key) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <Card onClick={() => {setSelectedTokenId(nft.tokenId); handleClose(); setShowDetailsModal(true);}}
  sx={{
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: (theme) => `0 6px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
    },
    cursor: 'pointer',
  }}
>

            {nft.tokenURI ? (
              <CardMedia component="img" height="50" image={nft.tokenURI} />
            ) : 
              <CardMedia component="img" height="50" image="https://via.placeholder.com/150" />}
                        <Box sx={{ p: 2 }}>
              <Typography variant="body1">Token ID: {nft.tokenId}</Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    );
    };