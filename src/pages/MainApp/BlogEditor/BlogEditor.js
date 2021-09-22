import { useState, useEffect } from 'react';
import { MDEditor } from '../../../components/Blog/Editor/mdeditor';
import { useParams } from "react-router-dom";
import { useDocListener, updateDoc } from '../../../hooks/firestore';
import Button from '@mui/material/Button';
import {Helmet} from "react-helmet";

export default function BlogPage() {
    let { postId } = useParams();
    const [editedPost, setEditedPost] = useState({});

    const blogDoc = useDocListener(`blogs/${postId}`)
    useEffect(() => setEditedPost(blogDoc), [blogDoc])

    const { loaded, body } = editedPost;

    const handleSaveBlog = () => {
        updateDoc(`blogs/${postId}`, editedPost)
    }
    return <div className="p-6">
        <Helmet>
            <meta charSet="utf-8" />
            <title>Blog Editor | Speer Education</title>
        </Helmet>
        {loaded && <>
            <MDEditor defaultValue={body} onChange={val => setEditedPost({ ...editedPost, body: val() })} />
        </>}
        <Button className="float-right" variant="outlined" onClick={handleSaveBlog}>
            Save Changes
        </Button>
    </div>
}