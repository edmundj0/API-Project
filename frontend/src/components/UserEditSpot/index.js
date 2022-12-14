import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { getOneSpot, putSpot } from "../../store/spots";
import "./UserEditSpot.css";

export default function UserEditSpot() {
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const [errors, setErrors] = useState([]);

    const history = useHistory()
    const dispatch = useDispatch()
    const { spotId } = useParams()

    const currentUser = useSelector(state => state.session.user)
    const oneSpotRes = useSelector(state => {
        // console.log('oneSpotRes useSELECTOR FIRED')
        return state.spot.individualSpot
    })

    useEffect(() => {
        // (console.log('spotId USEEFFECT FIRED'))
        dispatch(getOneSpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        // (console.log('onespotres USEEFFECT FIRED'))
        if (oneSpotRes) {
            setName(oneSpotRes.name)
            setAddress(oneSpotRes.address)
            setCity(oneSpotRes.city)
            setState(oneSpotRes.state)
            setCountry(oneSpotRes.country)
            setDescription(oneSpotRes.description)
            setPrice(oneSpotRes.price)
        }
    }, [oneSpotRes])

    // console.log(currentUser, 'currentUser')
    // console.log(oneSpotRes, 'oneSpotRes')
    // console.log(spotId, 'spotId')
    // console.log(name, 'name')

    const info = {
        name,
        address,
        city,
        state,
        country,
        description,
        price,
        lat: oneSpotRes.lat,
        lng: oneSpotRes.lng
    }


    const onSubmit = async (e) => {
        e.preventDefault()
        let updatedSpot = await dispatch(putSpot(info, spotId))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors)
            })

        console.log(updatedSpot, 'updatedSpot')

        if (updatedSpot) {
            setErrors([])
            history.push('/about-me/spots')
        }



    }

    if (!currentUser) return <Redirect to="/" />

    if (!oneSpotRes) return (
        <div>
            Error 404: Spot couldn't be found
        </div>
    )



    return (
        <div className='entire-edit-page'>
            <h1>Update Spot</h1>
            <ul>
                {Object.values(errors).map((error, idx) => <li key={idx} className="editspot-error-list">{error}</li>)}
            </ul>
            <form onSubmit={onSubmit} className="edit-spot-form">

                    <input required
                        type="text"
                        className="edit-form-input-description"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Spot Name"></input>


                    <input required
                        type="text"
                        className="edit-form-input-description"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        placeholder="Address"></input>


                    <input required
                        type="text"
                        className="edit-form-input-description"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        placeholder="City"></input>


                    <input required
                        type="text"
                        className="edit-form-input-description"
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        placeholder="State"></input>


                    <input required
                        type="text"
                        className="edit-form-input-description"
                        onChange={(e) => setCountry(e.target.value)}
                        value={country}
                        placeholder="Country"></input>

                    <div id="price-per-night-edit">&nbsp;Price per night (USD)</div>
                    <input required
                        type="number" min="0"
                        className="edit-form-input-description"
                        onChange={(e) => setPrice(e.target.value)}
                        value={price}
                        placeholder="Price"></input>


                    <textarea required
                        type="text"
                        className="edit-form-input-description description-textarea"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        placeholder="Description"></textarea>


                {/* <button>Cancel</button> */}
                <button type="submit" className="edit-submit-button">Save Changes</button>
            </form>
        </div>
    )

}
