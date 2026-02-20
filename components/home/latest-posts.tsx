import Link from "next/link"
export function LatestPosts({ posts }: { posts: any[] }) {
    // If no posts provided, return null or empty state
    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-muted/30 border-y py-8 sm:py-12 mt-8 sm:mt-12">
            <div className="w-full max-w-[1300px] mx-auto px-4 space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-bold">Latest Blog Posts</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Clear insights, practical guides, and thoughtful perspectives on color meaning, psychology, and real-world use
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {posts.map((post: any, index: number) => {
                        const excerpt = (post?.excerpt || "")
                            .replace(/<[^>]*>/g, "")
                            .replace(/&nbsp;/g, " ")
                            .replace(/&amp;/g, "&")
                            .substring(0, 120) + "...";

                        return (
                            <Link
                                key={post.id}
                                href={post.uri}
                                className="group flex flex-col h-full bg-background rounded-xl overflow-hidden border hover:shadow-lg transition-all hover:border-primary/50"
                            >
                                <div className="p-4 flex flex-col flex-1 space-y-2">
                                    <h3 className="line-clamp-2 text-base font-bold group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {excerpt}
                                    </p>
                                    <div className="pt-2 mt-auto">
                                        <span className="text-primary font-semibold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Read post <span className="text-base">→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                <div className="text-center pt-4">
                    <Link
                        href="/blog/"
                        className="inline-flex items-center justify-center h-12 px-8 rounded-full font-semibold border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Explore All Articles
                    </Link>
                </div>
            </div>
        </div>
    )
}
