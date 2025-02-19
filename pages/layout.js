import React from "react";

// INTERNAL IMPORT
import {
    Logo,
    Button,
    Card,
    Footer,
    CheckBox,
    Filter,
    Donate,
    Form,
    Notification,
    Profile,
    Login,
    Header,
    SignUp,
    Upload,
    Product,
} from "../Components";

const layout = () => {
    return (
        <div className="home">
            <p>Header</p>
            <Header />
            <p>Product</p>
            <Product/>
            <p>Upload</p>
            <Upload/>
            <p>LOGO</p>
            <Logo />
            <p>BUTTON</p>
            <Button />
            <p>Notification</p>
            <Notification />
            <p>Filter</p>
            <Filter />
            <p>CARD</p>
            <Card />
            <p>Donate</p>
            <Donate />
            <p>Form</p>
            <Form />
            <p>Profile</p>
            <Profile />
            <p>Login</p>
            <Login />
            <p>SignUp</p>
            <SignUp/>
            <p>CheckBox</p>
            <CheckBox />
            <p>FOOTER</p>
            <Footer />
        </div>
    );
};

export default layout;
