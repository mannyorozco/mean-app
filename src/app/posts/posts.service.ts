import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private url = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient, private router: Router) {}

  public getPosts() {
    this.http
      .get<{ message: string; posts: any }>(this.url)
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        })
      )
      .subscribe(transformedPost => {
        this.posts = transformedPost;

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
    this.http
      .post<{ message: string; postId: string }>(this.url, post)
      .subscribe(responseData => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  public updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content
    };

    this.http.put(this.url + '/' + id, post).subscribe(res => {
      const updatedPost = [...this.posts];
      const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
      updatedPost[oldPostIndex] = post;
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  public deletePost(postId: string) {
    this.http.delete(this.url + '/' + postId).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

  public getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  public getPost(id: string): Observable<any> {
    return this.http.get<{ _id: string; title: string; content: string }>(
      this.url + '/' + id
    );
  }
}
