"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { performStaticSearch, performSimpleSearch } from "@/lib/static-search-utils"
import blogPostsData from "@/lib/blog-posts-data.json"

export function SearchBar() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const blogPosts = Array.isArray(blogPostsData) ? blogPostsData : []
    const searchResult =
      blogPosts.length > 0 ? performStaticSearch(searchValue, blogPosts) : performSimpleSearch(searchValue)

    if (!searchResult) {
      return
    }

    const relative = searchResult.replace("https://hexcolormeans.com", "")
    router.push(relative)
  }

  return (
    <div className="flex items-center flex-1 md:flex-none md:w-auto">
      <form onSubmit={handleSearch} className="relative hidden md:block md:w-56 lg:w-48 xl:w-64">
        <Input
          type="text"
          placeholder="Search color..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pr-10"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>

      <form onSubmit={handleSearch} className="relative md:hidden w-full flex-1">
        <Input
          type="text"
          placeholder="Search color..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pr-10 w-full"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}

