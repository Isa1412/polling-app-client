import axios from "axios";
import {ACCESS_TOKEN, API_BASE_URL, POLL_LIST_SIZE} from "../constants/Constants";

const request = async (options) => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
        options = Object.assign({}, options, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
            }
        });
    }

    return await axios(options)
        .then(response => {
            return response.data;
        }).catch(error => {
            console.log("API error", error);
            return Promise.reject(error);
        })
};

export default class PollService {
    static async login(loginRequest) {
        return await request({
            method: 'post',
            url: API_BASE_URL + "/auth/signin",
            data: loginRequest
        });
    }

    static async checkUsernameAvailability(username) {
        return await request({
            method: 'get',
            url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username
        });
    }

    static async checkEmailAvailability(email) {
        return await request({
            method: 'get',
            url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email
        });
    }

    static async signup(signupRequest) {
        return await request({
            method: 'post',
            url: API_BASE_URL + "/auth/signup",
            data: signupRequest
        });
    }

    static async getCurrentUser() {
        if (!localStorage.getItem(ACCESS_TOKEN)) {
            return Promise.reject("No access token set.");
        }

        return await request({
            method: 'get',
            url: API_BASE_URL + "/user/me"
        });
    }

    static async createPoll(pollData) {
        return await request({
            method: 'post',
            url: API_BASE_URL + "/polls",
            data: pollData
        });
    }

    static async getAllPolls(page, size) {
        page = page || 0;
        size = size || POLL_LIST_SIZE;

        return await request({
            method: 'get',
            url: API_BASE_URL + "/polls?page=" + page + "&size=" + size
        });
    }

    static async getUserCreatedPolls(username, page, size) {
        page = page || 0;
        size = size || POLL_LIST_SIZE;

        return await request({
            method: 'get',
            url: API_BASE_URL + "/users/" + username + "/polls?page=" + page + "&size=" + size
        });
    }

    static async getUserVotedPolls(username, page, size) {
        page = page || 0;
        size = size || POLL_LIST_SIZE;

        return await request({
            method: 'get',
            url: API_BASE_URL + "/users/" + username + "/votes?page=" + page + "&size=" + size
        });
    }

    static async getUserProfile(username) {
        return await request({
            method: 'get',
            url: API_BASE_URL + "/users/" + username
        });
    }

    static async castVote(voteData) {
        return await request({
            method: 'post',
            url: API_BASE_URL + "/polls/" + voteData.pollId + "/votes",
            data: voteData
        });
    }
}