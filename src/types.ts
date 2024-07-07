export const blogTitle = "grant's blog";

export type Category = 'frontend' | 'backend' | 'devops';

export type CategoryData = {
    name: string;
    color: { dark: string; light: string };
};

export const categories: Record<Category, CategoryData> = {
    frontend: {
        name: 'Frontend',
        color: { dark: '0, 216, 255', light: '0, 158, 187' },
    },
    backend: {
        name: 'Backend',
        color: { dark: '32, 128, 128', light: '0, 128, 128' },
    },
    devops: {
        name: 'Devops',
        color: { dark: '29, 99, 237', light: '29, 99, 237' },
    },
};

export type Post = {
    title: string;
    pubDate: string;
    description: string;
    author: string;
    category: Category;
};
