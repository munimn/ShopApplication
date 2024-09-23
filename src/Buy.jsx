import { useState, useRef, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";
import { silentJSON, processAlert } from "./FetchRoutines";
function Buy() {
    useEffect(() => { getItems }, []);
    let searchInput = useRef("");
    const jwt = useContext(AuthContext);
    const [items, setItems] = useState([]);
    function getItems() {
        const headers = { "Authorization": "Bearer " + jwt };

        fetch("http://localhost:8085/item?tag=" + searchInput.current.value, { method: "GET", headers: headers }).then(silentJSON)
            .then(response => { setItems(response) });

    }
    function Itemsdiv() {
        return (
            <div style={{ padding: '10px' }}>
                <h3> Items To buy</h3>
                <table>
                    <thead>
                        <tr>
                            <th style={{ padding: '40px' }}>Item Name </th>
                            <th style={{ padding: '40px' }}>Description </th>
                            <th style={{ padding: '40px' }}>
                            </th>
                            <th style={{ padding: '40px' }}>Price</th>
                            <th style={{ padding: '40px' }}>Stock </th>
                            <th style={{ padding: '40px' }}>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {items.map(s => { return (<Itemstable key={s.iditem} s={s} itempurchase={ItemPurchase} />); })}
                    </tbody>
                </table>


            </div>
        )

    }
    function Itemstable({ s, itempurchase }) {
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
                    <Purchase item={s} doPurchase={itempurchase}></Purchase>
                </td>
            </tr>
        )

    }
    function Purchase({ item, doPurchase }) {
        const action = () => doPurchase(item);
        return (
            <>
                <button onClick={action}>Purchase</button>
            </>
        )
    }
    function ItemPurchase(n) {
        const item = { item: n.iditem }
        const headers = { "Authorization": "Bearer " + jwt, "Content-type": "application/json; charset=UTF-8" };

        fetch("http://localhost:8085/purchase", {
            method: "POST",
            body: JSON.stringify(item),
            headers: headers
        }).then(()=>getItems()).then(response => processAlert(response, "Item Purchased."));

    }
    if (jwt.length == 0)
        return (
            <p>You are not logged in to your account.</p>
        );
    else
        return (
            <>
                <p>Search Tag: <input type="text" ref={searchInput} /></p>
                <p><button onClick={getItems}>Search</button></p>
                <Itemsdiv></Itemsdiv>
            </>

        );



}
export default Buy;