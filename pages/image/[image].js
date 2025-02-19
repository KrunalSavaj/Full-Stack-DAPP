import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

// INTERNAL IMPORT
import {
    Card,
    Header,
    Footer,
    Notification,
    Logo,
    Product,
} from "../../Components";
import { useStateContext } from "../../Context/NFTs";

const imageDetail = () => {
    const {
        address,
        contract,
        getUploadedImages,
        setLoading,
        loading,
        donateFund,
        singleImage,
        setProvider,
    } = useStateContext();

    // URL QUERY
    const router = useRouter();
    const { query } = router;

    const [allImages, setAllImages] = useState([]);
    const [notification, setNotification] = useState("");
    const [support, setSupport] = useState("");
    const [image, setImage] = useState();

    const fetchImages = async () => {
        const oneImage = await singleImage(query.image * 1);
        const images = await getUploadedImages();
        setAllImages(images);
        setImage(oneImage);
    };
    useEffect(() => {
        if (contract) fetchImages();
    }, [address, contract]);

    useEffect(() => {
      if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
      } else {
          console.log("kai nathi");
      }
  }, []);


    const donateAmount = async () => {
        setLoading(true);
        await donateFund({
            amount: ethers.utils.parseUnits(support, 18),
            Id: query.image,
        });
    };

    return (
        <div className="home">
            <Header
                notification={notification}
                setNotification={setNotification}
            />

            {image == undefined ? (
                <Logo />
            ) : (
                <Product
                    setLoading={setLoading}
                    donateAmount={donateAmount}
                    setNotification={setNotification}
                    setSupport={setSupport}
                    image={image}
                />
            )}
            <div className="card">
                {allImages
                    .map((image, i) => (
                        <Card
                            key={i + 1}
                            index={i}
                            image={image}
                            setNotification={setNotification}
                        />
                    ))
                    .slice(0, 8)}
            </div>

            <Footer />
            {/* Notification */}
            {notification != "" && (
                <Notification
                    notification={notification}
                    setNotification={setNotification}
                />
            )}

            {/* Loader */}
            {loading && (
                <div className="loader">
                    <Logo />
                </div>
            )}
        </div>
    );
};

export default imageDetail;
