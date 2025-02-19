import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

import { ethers } from "ethers";

require("dotenv").config();

//dotenv.config({ path: "./config.env" });

// INTERNAL IMPORT
import {
    Card,
    Upload,
    Button,
    Profile,
    Header,
    Footer,
    Notification,
    Logo,
    Filter,
    Form,
} from "../Components";

import { useStateContext } from "../Context/NFTs";
import images from "../Components/Image/client/index";
import image from "./image/[image]";
import { useBalance } from "@thirdweb-dev/react";

const Home = () => {
    // STATE VARIABLE
    const {
        account: address,
        disconnect,
        contract,
        connect,

        UploadImage,
        getUploadedImages,
        setLoading,
        loading,
        // API
        getAllNftsAPI,
        setProvider,
    } = useStateContext();
    const [openProfile, setOpenProfile] = useState(false);
    const [closeForm, setCloseForm] = useState(true);
    const [file, setFile] = useState(null);
    const [display, setDisplay] = useState(null);
    const [notification, setNotification] = useState("");
    const [allImages, setAllImages] = useState([]);
    const [activeSelect, setActiveSelect] = useState("Old Images");
    const [imagesCopy, setImagesCopy] = useState([]);

    // GET DATA
    const oldImages = [];

    const fetchImages = async () => {
        const images = await getUploadedImages();
        setAllImages(images);

        // api nfts
        const apiImages = await getAllNftsAPI();
    };
    useEffect(() => {
        if (contract) fetchImages();
    }, [contract]);

    if (allImages.length == 0) {
        console.log("Loading");
    } else {
        //  console.log(allImages)
        allImages.map((el) => oldImages.push(el));
        //  console.log(oldImages);
    }

    // IMAGE DATA
    const [category, setCategory] = useState("");
    const [imageInfo, setImageInfo] = useState({
        title: "",
        description: "",
        email: "",
        category: "",
        image: "",
    });
    // console.log("imageInfo============>", imageInfo);
    const handleFormFieldChange = (fieldName, e) => {
        e.preventDefault();
        setImageInfo({ ...imageInfo, [fieldName]: e.target.value });
    };

    const key = "aeaf820004d909c4277d";
    const secret =
        "46a43c13bb2db8a005b23d2ce15a181f5acf9fd8c1fc83fbe5f2fe0a1541424b";
    // UPLOAD
    const handleSubmit = async (e) => {
        e.preventDefault();
        setCloseForm(false);
        setLoading(true);
        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const response = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: `${key}`,
                        pinata_secret_api_key: `${secret}`,
                        "Content-Type": "multipart/form-data",
                    },
                });

                const image = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
                await UploadImage({
                    ...imageInfo,
                    image: image,
                    category: category,
                });
                setFile(null);
            } catch (err) {
                console.log(err);
            }
        }
        setFile(null);
    };

    const retrieveFile = (e) => {
        const data = e.target.files[0];

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        };
        e.preventDefault();
    };

    // TAKE IMAGE
    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setDisplay(URL.createObjectURL(event.target.files[0]));
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
        } else {
            console.log("kai nathi");
        }
    }, []);

    return (
        <div className="home">
            <Header
                notification={notification}
                setNotification={setNotification}
            />
            <div className="header">
                <h1>Create 1000 NFTs for Free</h1>
            </div>
            {/* UPLOAD */}
            <div className="upload">
                <Upload
                    onImageChange={onImageChange}
                    display={display}
                    address={address}
                    retrieveFile={retrieveFile}
                />
                <div className="upload-info">
                    <h1>Welcome to NFTs IPFS Upload</h1>
                    <p>
                        Our products help you securely distribute any type of
                        media at scale-freeing fom restrictive platform,
                        middlemen, and algorithms that limit your creative
                        agency.
                    </p>
                    <div className="avatar">
                        <Button
                            address={address}
                            disconnect={disconnect}
                            connect={connect}
                            file={file}
                        />

                        {address && (
                            <p>
                                <Image
                                    className="avatar_img"
                                    src={images.client1}
                                    width={40}
                                    height={40}
                                    onClick={() => setOpenProfile(true)}
                                />
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <h1 className="subheading">All NFTs Marketplace</h1>
            {/* <h1 className="subheading">{isLoading ? 'loading...' : `${data}`}</h1> */}

            {/* CARD */}

            {allImages.length == 0 ? (
                <Logo />
            ) : allImages == undefined ? (
                <h1>No Images</h1>
            ) : (
                <>
                    <Filter
                        setImagesCopy={setImagesCopy}
                        imagesCopy={imagesCopy}
                        setAllImages={setAllImages}
                        allImages={allImages}
                        oldImages={oldImages}
                        activeSelect={activeSelect}
                        setActiveSelect={setActiveSelect}
                    />

                    <div className="card">
                        {allImages.map((image, i) => (
                            <Card
                                key={i + 1}
                                index={i}
                                image={image}
                                setNotification={setNotification}
                            />
                        ))}
                    </div>
                </>
            )}

            <Footer />

            {/* NOTIFICATION */}
            {notification != "" && (
                <Notification
                    notification={notification}
                    setNotification={setNotification}
                />
            )}
            {/* PROFILE */}
            {openProfile && (
                <div className="profile">
                    <Profile
                        setOpenProfile={setOpenProfile}
                        userBalance={useBalance}
                        address={address}
                    />
                </div>
            )}
            {/* LOADER */}
            {loading && (
                <div className="loader">
                    <Logo />
                </div>
            )}
            {/* FORM */}
            {file && closeForm && (
                <div className="form">
                    <div className="form_inner">
                        <Form
                            setFile={setFile}
                            setDisplay={setDisplay}
                            handleFormFieldChange={handleFormFieldChange}
                            handleSubmit={handleSubmit}
                            setCategory={setCategory}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
