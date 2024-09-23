import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { silentJSON, processAlert } from "./FetchRoutines";
function Items() {
    useEffect(() => { getItems() }, []);
    let nameInput = useRef();
    let descriptionInput = useRef();
    let imageInput = useRef();
    let priceInput = useRef();
    let stockInput = useRef();
    let tagsInput = useRef();
    const jwt = useContext(AuthContext);
    const [items, setItems] = useState([]);
    function getItems() {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/item/forseller`, { method: "GET", headers: headers }).then(silentJSON)
            .then(response => { setItems(response) });

    }
    function Itemsdiv() {
        return (
            <div style={{ padding: '10px' }}>
                <h3> Items You posted for sell</h3>
                <table>
                    <thead>
                        <tr>
                            <th style={{ padding: '40px' }}>Item Name </th>
                            <th style={{ padding: '40px' }}>Description </th>
                            <th style={{ padding: '40px' }}>Image</th>
                            <th style={{ padding: '40px' }}>Price</th>
                            <th style={{ padding: '40px' }}>Stock </th>


                        </tr>
                    </thead>
                    <tbody>
                        {items.map(s => { return (<Itemstable key={s.iditem} s={s} itemremove={Itemremoval} />); })}
                    </tbody>
                </table>


            </div>
        )

    }

    function Itemstable({ s, itemremove }) {
        return (
            <tr>
                <td style={{ padding: '40px' }}>{s.name}</td>
                <td style={{ padding: '40px' }}>{s.description}</td>
                <td style={{ padding: '40px' }}>
                    <img src={s.image} alt="Item Image" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                </td>
                <td style={{ padding: '40px' }}>${s.price / 100}</td>
                <td style={{ padding: '40px' }}>{s.stock}</td>
                <td>
                    <Remover item={s} doRemove={itemremove}></Remover>
                </td>
            </tr>
        )

    }
    function Remover({ item, doRemove }) {
        const action = () => doRemove(item);
        return (
            <>
                <button onClick={action}>Remove</button>
            </>
        )
    }
    function Itemremoval(n) {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch(`http://localhost:8085/item/${n.iditem}`, { method: "DELETE", headers: headers }).then(() => getItems());

    }

    function AddItem() {

        // Get the input values from the form
        const newItem = {
            name: nameInput.current.value,
            description: descriptionInput.current.value,
            image: imageInput.current.value,
            price: parseInt(priceInput.current.value),
            stock: parseInt(stockInput.current.value),
            tags: tagsInput.current.value.split(",").map((tag) => tag.trim())
        };

        // Perform any necessary validations on the new item

        const headers = { "Authorization": "Bearer " + jwt, "Content-type": "application/json; charset=UTF-8" };

        fetch("http://localhost:8085/item", {
            method: "POST",
            body: JSON.stringify(newItem),
            headers: headers
        }).then(() => getItems()).then(response => processAlert(response, "Items Added Successfully."));

        // Clear the form fields after adding the item
        nameInput.current.value = "";
        descriptionInput.current.value = "";
        imageInput.current.value = "";
        priceInput.current.value = "";
        stockInput.current.value = "";
        tagsInput.current.value = "";
    }

    if (jwt.length == 0)
        return (
            <p>You are not logged in to your account.</p>
        );
    else
        return (
            <>
                <Itemsdiv></Itemsdiv>
                <h4>Add a new item</h4>
                <p>Item name: <input type="text" ref={nameInput} /></p>
                <p>Description: <input type="text" ref={descriptionInput} /></p>
                <p>image: <input type="text" ref={imageInput} /></p>
                <p>Price: <input type="text" ref={priceInput} /></p>
                <p>Stock: <input type="text" ref={stockInput} /></p>
                <p>Tags Comma Separated : <input type="text" ref={tagsInput} /></p>
                <p><button onClick={AddItem}>Add Item to Sell</button></p>
            </>



        );
}

export default Items;