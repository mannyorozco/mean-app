import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list-component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public userId: string;
  public userIsAuthenticated = false;
  public posts: Post[] = [];
  public isLoading = false;
  public totalPosts = 10;
  public postsPerPage = 2;
  public pageSizeOptions = [1, 2, 5, 10];
  public currentPage = 1;
  private postSubscription: Subscription;
  private authListerSubscription: Subscription;

  constructor(private postService: PostsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();

    this.postSubscription = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  public onChangedPage(pageData: PageEvent): void {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  public onDelete(postId: string): void {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(
      () => {
        this.postService.getPosts(this.postsPerPage, this.currentPage);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }

    if (this.authListerSubscription) {
      this.authListerSubscription.unsubscribe();
    }
  }
}
