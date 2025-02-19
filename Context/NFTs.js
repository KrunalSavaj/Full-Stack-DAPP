import React, { useState, useEffect, useContext, createContext } from "react";
import { useSDK } from "@metamask/sdk-react";
import axios from "axios";
import {
    //NEW HOOKS FOR FRONTEND
    useDisconnect,
    useSigner,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

import abi from "../ContractABI";
//import { contract } from "web3/lib/commonjs/eth.exports";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [provider, setProvider] = useState();

    //const address = useAddress();

    // const { sdk, connected, connecting, chainId } = useSDK();
    const [account, setAccount] = useState();

    const connect = () => {
        try {
            if (window.ethereum) {
                window.ethereum
                    .request({
                        method: "eth_requestAccounts",
                    })
                    .then((e) => (setAccount(e[0]), console.log(e)));
            }
        } catch (err) {
            console.warn(`failed to connect..`, err);
        }
    };

    const ContractAddress = "0x272aD549C0Dbc613e4cf3aF8c4eFD7f16F9A2fe3";

    const signer1 = provider?.getSigner();
    const jsonProvider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/711f14ef45b14db7b46b5e043f7dc869`);
    const contract = new ethers.Contract(ContractAddress, abi.abi, jsonProvider);

    // useEffect(() => {
    //     if(provider)
    // },[])

    // FRONTEND
    const disconnect = ()=> {
        setAccount("");
    }
    // const signer = useSigner();
    const [userBalance, setUserBalance] = useState();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            // USER BALANCE
            if (provider) {
                const balance = await provider.getBalance();
                const userBalance = account
                    ? ethers.utils.formatEther(balance?.toString())
                    : "";
                setUserBalance(userBalance);
                console.log(userBalance);
            } else {
                setUserBalance("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [provider]);

    // CONTRACT FUNCTION
    //---UPLOAD
    const UploadImage = async (imageInfo) => {
        const { title, description, email, category, image } = imageInfo;
        try {
            console.log(imageInfo);

            const ContractAddress =
                "0x272aD549C0Dbc613e4cf3aF8c4eFD7f16F9A2fe3";

            const signer1 = provider.getSigner();
            const address = await signer1.getAddress();
            const contract = new ethers.Contract(
                ContractAddress,
                abi.abi,
                signer1
            );

            const listPrice = await contract.listingPrice();
            console.log(listPrice.toString());
            if (
                !title ||
                !description ||
                !email ||
                !category ||
                !address ||
                !image
            ) {
                return console.error("please provide full data!");
            }

            const createNFTs = await contract.uploadIPFS(
                address,
                image,
                title,
                description,
                email,
                category,
                { value: listPrice.toString() }
            );

            //API CALL
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
            window.location.reload();
        } catch (error) {
            console.log("contract call failure: ", error);
        }
    };

    /// Get CONTRACT DATA
    const getUploadedImages = async () => {
        let allImages;
        // All Images
        if (provider) {
            const images = await contract.getAllNFTs();

            //TOTAL Upload
            const totalUpload = await contract.imagesCount();

            //Listing PRICE
            const listingPrice1 = await contract.listingPrice();

            allImages = images.map((image, i) => ({
                owner: image.creator,
                title: image.title,
                description: image.description,
                email: image.email,
                category: image.category,
                fundraised: image.fundraised.toNumber(),
                image: image.image,
                imageID: image.id.toNumber(),
                cretedAt: image.timestamp.toNumber(),
                listedAmount: ethers.utils.formatEther(
                    listingPrice1.toString()
                ),
                totalUpload: totalUpload.toNumber(),
            }));
        } else {
            allImages = [];
        }

        // console.log(allImages);

        return allImages;
    };

    /// GET SINGLE IMAGE
    const singleImage = async (id) => {
        let image;
        try {
            if (provider) {
                const data = await contract.getImage(id);
                console.log(data);

                image = {
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
            } else {
                image = {};
            }

            return image;
        } catch (error) {
            console.log(error);
        }
    };

    /// DONATE
    const donateFund = async ({ amount, Id }) => {
        try {
            console.log(amount, Id);
            const signerWithCon = contract.connect(signer1);
            const transaction = await signerWithCon.donateToImage(Id, {
                value: amount.toString(),
            });
            // await transaction;
            console.log("transaction  =========>>>", transaction);
            setLoading(false);
            window.location.reload();
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
        console.log(response);
    };

    /// SINGLE NFTs API
    const getSingleNftsAPI = async (id) => {
        const response = await axios({
            method: "GET",
            url: `http://localhost:3001/api/v1/NFTs/${id}`,
        });
        console.log(response);
    };

    //const contract = false;

    return (
        <StateContext.Provider
            value={{
                account,
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
                setProvider,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
