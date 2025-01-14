import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Receivers from '../../../components/messages/Receivers';
const socket = io.connect("http://192.168.1.4:3001")

import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import Request from '../../../API_Callings/Request';
import AppUser from '../../../StaticData/AppUser';
import BodyHeader from '../../../components/headers/BodyHeader';
import RequestBox from '../../../components/popups/RequestBox';
import DoubleTab from '../../../components/sub-headers/DoubleTab';
import RatingPopup from './ratingPopUp';

const CropAdvisiors = () => {

    const app_user = new AppUser

    const [leftTab, setLeftTab] = useState(true)
    const [advisiors, setAdvisiors] = useState([])
    const [professional, setProfessional] = useState({ id: '', name: '' })
    const [click, setClick] = useState(false)

    const [text, setText] = useState('')
    const [selectedCrop, setSelectedCrop] = useState('')

    const [allMessages, setAllMessages] = useState([])
    const [showChat, setShowChat] = useState(false)
    const [chatExpand, setChatEpand] = useState(false)

    const show_Chatting = async (index) => {

        try {
            setChatEpand(!chatExpand)
        }

        catch (err) {
            console.log(err)
        }

        setAllMessages(current => {
            const remake = [...current]
            remake[index] = { ...remake[index], chat: chatExpand }
            return remake
        })
    }


    useEffect(() => {

        const get_Professionals = async () => {
            const request = new Request

            try {
                const response = await request.Advice()

                if (response != null) {
                    setAdvisiors(response.data)
                }

                else {
                    console.log('_ERROR')
                }
            }

            catch (err) {
                console.log(err)
            }
        }

        get_Professionals()

        //Getting Chat
        socket.emit("previous", { role: 0, need: app_user.fetch().id })

        socket.on("inbox", (allMSGS) => {

            if (allMSGS != 0) {
                setAllMessages(allMSGS)
                setShowChat(true)
            }
        })

    }, []);

    const send_Request = (id, name) => {
        setProfessional({ id: id, name: name })
        setClick(true)
    }

    const submit_Message = (msg) => {
        setText(msg)
    }

    const post_Message = () => {
        send_Message(`I am a ${selectedCrop} farmer, ${text}`)
    }

    const send_Message = async (message) => {

        const messageBody = {
            f_ID: app_user.fetch().id,
            f_Name: app_user.fetch().name,
            a_ID: professional.id,
            a_Name: professional.name,
            s_TYPE: "farmer",
            m_TEXT: message
        }

        await socket.emit("chat", messageBody)

        setSelectedCrop('')
        setText('')
        setClick(false)
    }

    const [popup, setPopup] = useState(false)
    const [receiverId, setReceiverId] = useState('')
    const [reload, setReload] = useState(false)

    const rateAdvisor = async (rate) => {
        if (rate === 0) {
            Alert.alert('Something went wrong..')
            return
        };
        if (receiverId === '') {
            Alert.alert('Something went wrong..')
            return
        };

        setReload(false);

        try {
            const request = new Request();
            const response = await request.UpdateUserRateByUserId(receiverId, { rating: rate });
            console.log(response.data);
            Alert.alert('Success', 'User rate updated successfully');
            setPopup(false);
            setReload(true);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to update user rate');
        }
    }


    useEffect(() => {
        if (!reload) return

        const get_Professionals = async () => {
            const request = new Request
            try {
                const response = await request.Advice()
                if (response != null) {
                    setAdvisiors(response.data)
                }
                else {
                    console.log('_ERROR')
                }
            }
            catch (err) {
                console.log(err)
            }
        }
        get_Professionals()

        //Getting Chat
        socket.emit("previous", { role: 0, need: app_user.fetch().id })
        socket.on("inbox", (allMSGS) => {
            if (allMSGS != 0) {
                setAllMessages(allMSGS)
                setShowChat(true)
            }
        })
    }, [reload])


    return (
        <View style={{ position: 'relative' }}>
            {popup && (<RatingPopup press_Action={() => setPopup(false)} rateAdvisor={rateAdvisor}  ></RatingPopup>)}

            <BodyHeader Title='Crop Advisiory'></BodyHeader>

            {click && (
                <RequestBox
                    Name={professional.name}
                    Close={() => setClick(false)}
                    Value={text}
                    get_Value={submit_Message}
                    Selected={setSelectedCrop}
                    Post={post_Message}>
                </RequestBox>
            )}

            <DoubleTab
                Mark={leftTab}
                LeftButton='Agricultural Professionals'
                press_LeftAction={() => setLeftTab(true)}
                RightButton='Requests'
                press_RightAction={() => setLeftTab(false)}>
            </DoubleTab>

            {leftTab && (
                <View style={styles.grid}>
                    <View style={styles.title}>
                        <Text style={styles.text_1}>Agricultural Professional</Text>
                        <Text style={styles.text_2}>Designation</Text>
                        <Text style={styles.text_3}>Rating</Text>
                        <Text style={styles.text_4}>Chat</Text>
                    </View>

                    <View>
                        {advisiors.map((advisior, index) => (
                            <View key={index} style={styles.title}>
                                <View style={styles.name}>
                                    <Image style={styles.image} source={require('../../../Assets/Icons/Account.png')} />
                                    <Text style={styles.content_1}>{advisior.name}</Text>
                                </View>

                                <Text style={styles.content_2}>{advisior.designation}</Text>
                                <Text style={styles.content_3}>{advisior.rating}</Text>

                                <View style={styles.chat}>
                                    <TouchableOpacity onPress={() => send_Request(advisior.id, advisior.name)}>
                                        <Image style={styles.message} source={require('../../../Assets/Icons/Message.png')} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {!leftTab && (
                <View>
                    {showChat && (
                        <View>
                            {allMessages.map((sender, index) => (
                                <Receivers
                                    key={index}
                                    Sender={sender.name}
                                    Id={sender.id}
                                    Data={sender.data}
                                    press_Action={() => show_Chatting(index)}
                                    OpenChat={sender.chat}
                                    Role='Farmer'
                                    show_PopUp={() => { setPopup(true) }}
                                    setReceiverId={setReceiverId}
                                >
                                </Receivers>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    grid: {
        marginTop: 20,
        marginHorizontal: 8
    },

    image: {
        height: 18,
        width: 18
    },

    message: {
        height: 19,
        width: 20
    },

    title: {
        display: 'flex',
        flexDirection: 'row',
        paddingVertical: 8
    },

    chat: {
        width: '14%',
        display: 'flex',
        alignItems: 'center'
    },

    text_1: {
        backgroundColor: '#005F41',
        color: 'white',
        width: '50%',
        textAlign: 'center',
        paddingVertical: 5,
    },

    text_2: {
        backgroundColor: '#005F41',
        color: 'white',
        width: '20%',
        textAlign: 'center',
        paddingVertical: 5
    },

    text_3: {
        backgroundColor: '#005F41',
        color: 'white',
        width: '16%',
        textAlign: 'center',
        paddingVertical: 5
    },

    text_4: {
        backgroundColor: '#005F41',
        color: 'white',
        width: '14%',
        textAlign: 'center',
        paddingVertical: 5
    },

    content_1: {
        marginLeft: 5,
        color: 'black',
    },

    content_2: {
        textAlign: 'center',
        color: 'black',
        width: '20%'
    },

    content_3: {
        textAlign: 'center',
        color: 'black',
        width: '16%'
    },

    name: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 7
    }
})

export default CropAdvisiors;