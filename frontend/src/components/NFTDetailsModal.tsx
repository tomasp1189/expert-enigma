import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Card,
    CardMedia,
    TextField,
    Grid,
    FormControl,
    CircularProgress,
  } from '@mui/material';
  import { useContext, useEffect, useState } from 'react';
  import { useGetNFTByTokenId } from '../hooks/useGetNFTByTokenId';
import { Store } from '../providers/Store';
  
  export const NFTDetailsModal: React.FC = () => {
    const {userStore} = useContext(Store);
    const {selectedTokenId, showDetailsModal, setShowDetailsModal} = userStore;
    const [viewTokenId, setViewTokenId] = useState<number>(selectedTokenId || null);
    const NFT = useGetNFTByTokenId(viewTokenId);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      selectedTokenId &&
        setViewTokenId(selectedTokenId);
    }, [selectedTokenId]);
    
    useEffect(() => {
        if (NFT) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [NFT]);

    const handleOpen = () => {
      setShowDetailsModal(true);
    };
    const handleClose = () => {
      setShowDetailsModal(false);
    };
  
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setViewTokenId(viewTokenId);
    };
  
    return (
      <>
        <Button variant="contained" color="primary" onClick={handleOpen}>
        Sloth Search
        </Button>
        <Dialog open={showDetailsModal} onClose={handleClose}>
          <DialogTitle>Sloth Finder</DialogTitle>
          <DialogContent>
            { loading && viewTokenId ? (
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
  ) : NFT && (
              <Box>
                <Card>
                  {NFT.tokenURI ? (
                    <CardMedia component="img" height="200" image={NFT.tokenURI} />
                  ) : (
                    <CardMedia component="img" height="200" image="https://via.placeholder.com/150" />
                  )}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="body1">Token ID: {NFT.tokenId}</Typography>
                  </Box>
                </Card>
                {/* Add more NFT details here if available */}
              </Box>
            )}
  
            <Box mt={2}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <FormControl fullWidth>
                      <TextField
                        label="Token ID"
                        type="number"
                        value={viewTokenId}
                        onChange={(event) => setViewTokenId(parseInt(event.target.value))}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button type="submit" variant="contained" color="primary">
                      View
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };