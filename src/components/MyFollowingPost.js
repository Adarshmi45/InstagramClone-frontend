import React, { useEffect, useState } from 'react';
import "./Home.css";
import { json, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import {Link } from "react-router-dom";


function MyFollowingPost() {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const [comment, setComment] = useState([])
    const [show, setShow] = useState(false)
    const [item, setItem] = useState([])


    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/signup")
        }

        fetch("http://localhost:5000/myfollowingpost", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result)})
            .catch(err => console.log(err))

    }, [])

    //to show and hide comments
    const toggleComment = (posts) => {
        if (show) {
            setShow(false);
        } else {

            setShow(true);
            setItem(posts);
            console.log(item)
        }
    }

    const likePost = (id) => {
        fetch("http://localhost:5000/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then((result) => {
                const newData = data.map((posts) => {
                    if (posts._id == result._id) {
                        return result
                    } else {
                        return posts
                    }
                })
                setData(newData)
                console.log(result)
            })
    }


    const unlikePost = (id) => {
        fetch("http://localhost:5000/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then((result) => {
                const newData = data.map((posts) => {
                    if (posts._id == result._id) {
                        return result
                    } else {
                        return posts
                    }
                });
                setData(newData);
                console.log(result)
            })
    };

    const makeComment = (text, id) => {
        fetch("http://localhost:5000/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                text: text,
                postId: id,

            })
        }).then(res => res.json())
            .then((result) => {
                const newData = data.map((posts) => {
                    if (posts._id == result._id) {
                        return result
                    } else {
                        return posts
                    }
                })
                setData(newData)
                setComment("");
                notifyB("Comment posted")
                console.log(result)
            })
    }

    return (
        <div className='home' >
            {/*card*/}
            {data.map((posts) => {
                return (<div className="card">
                    {/* card header */}
                    <div className="card-header" >
                        <div className="card-pic">
                            <img src="https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjA0fHxmYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt='' />
                        </div>
                        <h5>
                            <Link to={`/profile/${posts.postedBy._id}`}>
                            {posts.postedBy.name}
                            </Link>
                            </h5>
                    </div>
                    <div className="card-image">
                        <img src={posts.photo} alt='' />
                    </div>
                    <div className="card-content" >
                        {
                            posts.likes.includes(JSON.parse(localStorage.getItem("user"))._id) ?
                                (<span className="material-symbols-outlined material-symbols-outlined-red" onClick={() => { unlikePost(posts._id) }}>
                                    favorite
                                </span>)
                                : (<span className="material-symbols-outlined" onClick={() => { likePost(posts._id) }}>
                                    favorite
                                </span>)
                        }


                        <p>{posts.likes.length} Likes</p>
                        <p>{posts.body}</p>
                        <p style={{ fontWeight: "bold", cursor: "pointer" }} onClick={() => { toggleComment(posts) }}>View all comments</p>
                    </div>
                    <div className="add-comment">
                        <span className="material-symbols-outlined">
                            mood
                        </span>
                        <input type="text" placeholder="Add a comment" value={comment} onChange={(e) => {
                            setComment(e.target.value)
                        }} />
                        <button className='comment' onClick={() => {
                            makeComment(comment, posts._id)
                        }}>Post</button>
                    </div>
                </div>)
            })};

            {show && (
                <div className="showComment">
                    <div className="container">
                        <div className="postPic">
                            <img src={item.photo} alt='' />
                        </div>
                        <div className="details">
                            <div className="card-header" style={{ borderBottom: "1px solid #00000029" }}>
                                <div className="card-pic">
                                    <img src="https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjA0fHxmYWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" alt='' />
                                </div>
                                <h5>{item.postedBy.name}</h5>
                            </div>
                            <div className="comment-section" style={{ borderBottom: "1px solid #00000029" }}>
                                {item.comments.map((comment) => {
                                    return (<p className='comm'>
                                        <span className="commenter" style={{ fontWeight: "bolder" }}>{comment.postedBy.name}{""}  </span>
                                        <span className="commentText">{comment.comment}</span>
                                    </p>)
                                })}


                            </div>

                            <div className="card-content">



                                <p>{item.likes.length} Likes</p>
                                <p>{item.body}</p>
                            </div>
                            <div className="add-comment">
                                <span className="material-symbols-outlined">
                                    mood
                                </span>
                                <input type="text" placeholder="Add a comment" value={comment} onChange={(e) => {
                                    setComment(e.target.value)
                                }} />
                                <button className='comment'
                                    onClick={() => {
                                        makeComment(comment, item._id)
                                        toggleComment();
                                    }}
                                >Post</button>
                            </div>
                        </div>
                    </div>
                    <div className="close-comment" onClick={() => {
                        toggleComment();
                    }}>
                        <span class="material-symbols-outlined material-symbols-outlined-comment">
                            close
                        </span>
                    </div>
                </div>)
            }
        </div>
    )
}

export default MyFollowingPost;
