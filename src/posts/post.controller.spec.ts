import { PostsController } from "./post.controller";
import { TestingModule, Test } from "@nestjs/testing";
import { AdminService } from "../admin/admin.service";8
import { PostsService } from "./post.service";
import { AuthModule } from '../auth/auth.module';
import { AuthGuard, PassportModule } from "@nestjs/passport";

describe('Post controller', () => {
    let postController: PostsController;
    const postService = {
        viewAllPosts() {
            return null;
        },
        viewPostById() {
            return null;
        },
        createPost() {
            return null;
        },
        deletePost() {
            return null;
        },
        updatePost() {
            return null;
        }
    };
    beforeEach(async () => {
        const postModule: TestingModule = await Test.createTestingModule({
          controllers: [PostsController],
          providers: [
            {
              provide: PostsService,
              useValue: postService,
            },
            {
                provide: AdminService,
                useValue: {},
            },
            {
                provide: AuthModule,
                useValue: {}
            },
            {   
                provide: AuthGuard,
                useValue: {
                    canActivate: () => true
                }
            }
          ],
        }).compile();

        postController = postModule.get<PostsController>(PostsController);
    })
        it('should be defined', () => {
            expect(postController).toBeDefined();
        });

        describe('viewAllPosts()', () => {
           
            it('PostsService.viewAllPosts() should return the correct value', async () => {
                // Arrange
                const fakePost: any = {
                    id: 'fakePostId',
                    title: 'Test Title',
                    content: 'Test Content',
                    dateCreated: '10.04.2020',
                    dateUpdated: '10.04.2020',
                    isLocked: false,
                    isDeleted: false,
                    editor: 'fakeUser'
                }
                const spy = jest
                .spyOn(postService, 'viewAllPosts')
                .mockReturnValue(fakePost);
                // Act
                const postsToView = await postController.viewAllPosts()


                // Assert
                expect(spy).toHaveBeenCalledTimes(1);
                expect(postsToView).toEqual(fakePost);
    
                spy.mockRestore();
            }); 
    });
})