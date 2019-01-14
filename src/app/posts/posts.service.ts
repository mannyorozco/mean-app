import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  public getPosts(): Post[] {
    // spread oporator copies the posts array without modifying original data.
    return [...this.posts];
  }

  public addPost(title: string, content: string): void {
    const post: Post = {
      title: title,
      content: content
    };

    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }

  public getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }
}
