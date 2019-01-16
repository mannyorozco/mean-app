import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  public getPosts() {
    this.http.get<{ message: string; posts: Post[] }>(`${this.url}/posts`).subscribe(postData => {
      this.posts = postData.posts;

      // ... created copy of array
      this.postsUpdated.next([...this.posts]);
    });
  }

  public addPost(title: string, content: string): void {
    const post: Post = {
      id: '',
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
