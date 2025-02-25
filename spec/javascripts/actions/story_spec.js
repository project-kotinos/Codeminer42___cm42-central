import * as Story from 'actions/story';
import storyFactory from '../support/factories/storyFactory';

describe('Story Actions', () => {
  describe('saveStory', () => {
    const story = storyFactory();
    const projectId = 42;

    it('calls Story.update with story._editing and projectId', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: true
        }
      };

      const FakeStory = {
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false)
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [editedStory] });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(FakeStory.update).toHaveBeenCalledWith(editedStory._editing, projectId);
    });

    it('dispatch only toggleStory when _isDirty is false', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: false
        }
      };

      const FakeStory = {
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false)
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [editedStory] });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));
    });

    it('dispatch updateStorySuccess when _isDirty', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story,
          _isDirty: true
        }
      };

      const FakeStory = {
        update: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(false)
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [editedStory] });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.updateStorySuccess(story));
    });

    it('dispatch only addStory when isNew', async () => {
      const editedStory = {
        ...story,
        _editing: {
          ...story
        }
      };

      const FakeStory = {
        post: sinon.stub().resolves(story),
        isNew: sinon.stub().returns(true)
      };

      const fakeDispatch = sinon.stub().resolves({});

      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [editedStory] });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.addStory(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.updateStorySuccess(story));
      expect(fakeDispatch).not.toHaveBeenCalledWith(Story.toggleStory(editedStory.id));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const editedStory = {
        ...story,
        _editing: {
          ...story,
          loading: true,
          _isDirty: true
        }
      };

      const FakeStory = {
        update: sinon.stub().rejects(error),
        isNew: sinon.stub().returns(false)
      };

      const fakeDispatch = sinon.stub().resolves({});
      const fakeGetState = sinon.stub();
      fakeGetState.returns({ stories: [editedStory] });

      await Story.saveStory(editedStory.id, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(editedStory.id, error));
    });
  });

  describe('deleteStory', () => {
    const storyId = 420;
    const projectId = 42;

    it('calls Story.deleteStory with projectId and storyId', async () => {
      const FakeStory = {
        deleteStory: sinon.stub().resolves({})
      };
      const fakeGetState = sinon.stub().returns({
        stories: [{id: storyId, title: 'foo'}]
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(FakeStory.deleteStory).toHaveBeenCalledWith(storyId, projectId);
    });

    it('dispatch deleteStorySuccess', async () => {
      const FakeStory = {
        deleteStory: sinon.stub().resolves({})
      };
      const fakeGetState = sinon.stub().returns({
        stories: [{id: storyId, title: 'foo'}]
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.deleteStorySuccess(storyId));
    });

    it('dispatches storyFailure when promise fails', async () => {
      const error = { error: "boom" };

      const FakeStory = {
        deleteStory: sinon.stub().rejects(error)
      };
      const fakeGetState = sinon.stub().returns({
        stories: [{id: storyId, title: 'foo'}]
      });
      const fakeDispatch = sinon.stub().resolves({});

      await Story.deleteStory(storyId, projectId)
        (fakeDispatch, fakeGetState, { Story: FakeStory });

      expect(fakeDispatch).toHaveBeenCalledWith(Story.storyFailure(storyId, error));
    });
  });
});
