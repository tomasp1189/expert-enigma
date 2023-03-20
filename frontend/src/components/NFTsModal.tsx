import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, Box, Card, CardMedia, CircularProgress, alpha } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useGetUserNFTs } from "../hooks/useGetUserNFTs";
import { Store } from "../providers/Store";
export const NFTsModal : React.FC = () => {
    const [open, setOpen] = useState(false);
    const { userStore } = useContext(Store);
    const { setSelectedTokenId, setShowDetailsModal } = userStore;
    const [loading, setLoading] = useState(true);
    const address = useContext(Store).userStore.address;
    const NFTs = useGetUserNFTs(address);

    useEffect(() => {
        if (NFTs.length > 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [NFTs]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    
    return (
        <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
            View NFTs
        </Button>
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Your NFTs</DialogTitle>
            <DialogContent >
            {
  loading ? (
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
  ) : NFTs && (
    <Grid container spacing={2} sx={{
      pt: 2,
    }}>
      {NFTs.map((nft, index) => (
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