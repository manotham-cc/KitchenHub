import { useEffect, useState } from 'react';
import Post from '../post';
import SearchBar from '../SearchBar'; // Import the SearchBar component

export default function IndexPage() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/post')
            .then(response => response.json())
            .then(posts => {
                setPosts(posts);
                setFilteredPosts(posts); // Initially set filtered posts to all posts
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    const handleSearch = (searchTerm) => {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    return (
        <>
            <SearchBar onSearch={handleSearch} /> {/* Add the SearchBar component */}
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <Post key={post._id} {...post} />
                ))
            ) : (
                <p>No posts available</p>
            )}
        </>
    );
}