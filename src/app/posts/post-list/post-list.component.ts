import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list-component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  private postSubscription: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.postService.getPosts();

    this.postSubscription = this.postService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    if (this.postSubscription) {
      this.postSubscription.unsubscribe();
    }
  }
}
