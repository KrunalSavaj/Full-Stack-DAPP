import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import {
    useAddress,
    useContract,
    useMetamask,
    //NEW HOOKS FOR FRONTEND
    useDisconnect,
    useSigner,
    useContractRead,
    useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
//import { contract } from "web3/lib/commonjs/eth.exports";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(
        "0x4BB2D86dF3C5B844f77d2aFadB54aaF2D5d60d8d"
    );

    const {
        data: listPrice,
        isLoading,
        error,
    } = useContractRead(contract, "listingPrice");

    const {
        mutateAsync: uploadIPFSFun,
        isLoading: writeLoading,
        error: writeError,
    } = useContractWrite(contract, "uploadIPFS");

    //const [listPrices, setListPrices] = useState();

    const address = useAddress();
    const connect = useMetamask();

    // FRONTEND
    const disconnect = useDisconnect();
    const signer = useSigner();
    const [userBalance, setUserBalance] = useState();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            // USER BALANCE
            const balance = await signer?.getBalance();
            const userBalance = address
                ? ethers.utils.formatEther(balance?.toString())
                : "";
            setUserBalance(userBalance);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // CONTRACT FUNCTION
    //---UPLOAD
    const UploadImage = async (imageInfo) => {
        const { title, description, email, category, image } = imageInfo;
        console.log(imageInfo, address);
        try {
            uploadIPFSFun({
                args: [address, image, title, description, email, category],
                overrides: {
                    value: ethers.utils.parseEther("0.025"), // send 0.1 native token with the contract call
                },
            });

            /// API CALL
            const response = await axios({
                method: "POST",
                url: `http://localhost:3000/api/v1/NFTs`,
                data: {
                    title: title,
                    description: description,
                    category: category,
                    image: image,
                    address: address,
                    email: email,
                },
            });

            console.log(response);
            console.log("contract call success: ", createNFTs);

            setLoading(false);
            //window.location.reload();
        } catch (error) {
            console.log("contract call failure: ", error);
        }
    };

    /// Get CONTRACT DATA
    const getUploadedImages = async () => {
        // All Images
        const images = await contract.call("getAllNFTs");

        //TOTAL Upload
        const totalUpload = await contract.call("imagesCount");
        //Listing PRICE
        const listingPrice = await contract.call("listingPrice");
        const allImages = images.map((image, i) => ({
            owner: image.creator,
            title: image.title,
            description: image.description,
            email: image.email,
            category: image.category,
            fundraised: image.fundraised,
            image: image.image,
            imageID: image.id.toNumber(),
            cretedAt: images.timestamp.toNumber(),
            listedAmount: ethers.utils.formatEther(listingPrice.toString()),
            totalUpload: totalUpload.toNumber(),
        }));
        console.log(allImages);

        return allImages;
    };

    /// GET SINGLE IMAGE
    const singleImage = async (id) => {
        try {
            const data = await contract.call("getImage", [id]);

            const image = {
                title: data[0],
                description: data[1],
                email: data[2],
                category: data[3],
                fundRaised: ethers.utils.formatEther(data[4].toString()),
                creator: data[5],
                imageURL: data[6],
                createdAt: data[7].toNumber(),
                imageId: data[8].toNumber(),
            };

            return image;
        } catch (error) {
            console.log(error);
        }
    };

    /// DONATE
    const donateFund = async ({ amount, Id }) => {
        try {
            console.log(amount, Id);
            const transaction = await contract.call("donateToImage", [Id], {
                value: amount.toString(),
            });
        } catch (error) {
            console.log(error);
        }
    };

    /// GET API DATA
    const getAllNftsAPI = async () => {
        const response = await axios({
            method: "GET",
            url: "http://localhost:3000/api/v1/NFTs",
        });
        //console.log(response);
    };

    /// SINGLE NFTs API
    const getSingleNftsAPI = async (id) => {
        const response = await axios({
            method: "GET",
            url: `http://localhost:3001/api/v1/NFTs/${id}`,
        });
        console.log(response);
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                disconnect,
                userBalance,
                setLoading,
                loading,
                connect,
                // FUNCTION
                UploadImage,
                getUploadedImages,
                donateFund,
                singleImage,
                //  API
                getAllNftsAPI,
                getSingleNftsAPI,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
