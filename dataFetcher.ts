const API_URL = 'https://jsonplaceholder.typicode.com/posts';

interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

async function fetchPosts(): Promise<void> {
    try {
        const response = await fetch(API_URL);
        const posts: Post[] = await response.json();
        console.log(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

fetchPosts();