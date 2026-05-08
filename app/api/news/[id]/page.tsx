
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import { BlogPost } from "@/components/news/blog-post"
import { blogs } from "@/data/blogs"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  return blogs.map((blog) => ({
    id: blog.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${blog.title} - TaeTae Foundation`,
    description: blog.excerpt,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <BlogPost blog={blog} />
      <Footer />
    </main>
  )
}
