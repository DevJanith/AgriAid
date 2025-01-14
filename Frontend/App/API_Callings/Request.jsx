import Axios from "axios";
import { Component } from "react";

class Request extends Component {
    mainServer = 'http://192.168.1.4'

    serverURL = this.mainServer + ':8000'
    aiURL = this.mainServer + ':5000'

    Register(data) {
        const _API = '/register';
        return Axios.post(this.serverURL + _API, data);
    };

    Login(data) {
        const _API = '/login';
        return Axios.post(this.serverURL + _API, data);
    };

    List() {
        const _API = '/cropList';
        return Axios.get(this.serverURL + _API);
    }

    Recommendations(data) {
        const _API = '/allCrops';
        return Axios.post(this.serverURL + _API, data);
    }

    Advice() {
        const _API = '/advisiory';
        return Axios.get(this.serverURL + _API);
    }

    AdminRequests() {
        const _API = '/adminRequests';
        return Axios.get(this.serverURL + _API);
    }

    ApproveRequest(data) {
        const _API = '/confirmRequest';
        return Axios.put(this.serverURL + _API, data);
    }

    DeleteUser(data) {
        const _API = '/removeUser';
        return Axios.post(this.serverURL + _API, data);
    }

    FetchUsers(data) {
        const _API = '/acceptedUsers';
        return Axios.post(this.serverURL + _API, data)
    }

    Selected(data) {
        const _API = '/selectedCrop';
        return Axios.post(this.serverURL + _API, data)
    }

    Cultivate(data) {
        const _API = '/addCultivation';
        return Axios.post(this.serverURL + _API, data)
    }

    GetCultivate(data) {
        const _API = '/getCultivation';
        return Axios.post(this.serverURL + _API, data);
    }

    DeleteCultivation(data) {
        const _API = '/deleteCultivation';
        return Axios.post(this.serverURL + _API, data);
    }

    GrowedCrop(data) {
        const _API = '/getDate';
        return Axios.post(this.serverURL + _API, data);
    }

    Record(data) {
        const _API = '/record';
        return Axios.post(this.serverURL + _API, data);
    }

    GetRecordsByUserId(userId) {
        const _API = `/records/${userId}`;
        return Axios.get(this.serverURL + _API);
    }

    UpdateUserRateByUserId(userId, data) {
        const _API = `/users/${userId}/rate`;
        return Axios.patch(this.serverURL + _API, data);
    }

    //------------------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------------------------
    Add_Market(data) {
        const _API = '/marketConditions';
        return Axios.post(this.aiURL + _API, data);
    }

    Crop_Recommend(data) {
        const _API = '/cropRecommendations';
        return Axios.post(this.aiURL + _API, data);
    }
    //_________________________________________________________________________________________________________________
    //------------------------------------------------------------------------------------------------
    Add_Crop(data) {
        const _API = '/add';
        return Axios.post(this.serverURL + _API, data);
    }

}

export default Request;