import sinon from 'sinon';
import proxyquire from 'proxyquire';
import Sitemap from '../../app/models/sitemap';
import { cmsStatus } from '../../app/constants';

describe('sitemapController test', () => {
    let res;
    let next;
    let sitemapStub;
    let controller;

    before(() => {
        res = {
            status: sinon.spy(),
            send: sinon.spy(),
            get: sinon.spy(),
            header: sinon.spy()
        };
        next = sinon.spy();
        sitemapStub = sinon.stub(Sitemap);
    });

    beforeEach(() => {
        controller = proxyquire('../../app/controllers/sitemapController', {
            '../models/sitemap': sitemapStub,
            '@noCallThru': true
        });
    });

    afterEach(() => {
        res.status.reset();
        res.send.reset();
        res.get.reset();
        res.header.reset();
        next.reset();
        sitemapStub.upsert.reset();
        sitemapStub.destroy.reset();
        sitemapStub.findAll.reset();
        sitemapStub.findOne.reset();
        sitemapStub.restore();
    });

    describe('processMessage test', () => {
        let message = {
            site: "TEST",
            content: {
                id: 'TEST-1234',
                url: '/test/test1',
                path: [],   //Not testing sitemapDataMapper.getSitemapToSave
                nodeTypeAlias: 'Sitemap'
            }
        };

        it('should call upsert if published status', done => {
            message = {
                ...message,
                status: cmsStatus.published
            };

            sitemapStub.upsert.returns(Promise.resolve(true));
            sitemapStub.destroy.returns(Promise.resolve(true));
            controller.processMessage(message.status, message.site, message.content).then(() => {
                expect(sitemapStub.upsert.calledOnce).to.be.true;
                expect(sitemapStub.destroy.calledOnce).to.be.false;
            }).then(done, done);
        });

        [cmsStatus.unpublished, cmsStatus.trashed].forEach(status => {
            it(`should call destroy if ${status} status`, done => {
                message = {
                    ...message,
                    status: `${status}`
                };

                sitemapStub.upsert.returns(Promise.resolve(true));
                sitemapStub.destroy.returns(Promise.resolve(true));
                controller.processMessage(message.status, message.site, message.content).then(() => {
                    expect(sitemapStub.upsert.calledOnce).to.be.false;
                    expect(sitemapStub.destroy.calledOnce).to.be.true;
                }).then(done, done);
            });
        });

        it('should not call upsert or destory if saved status', done => {
            message = {
                ...message,
                status: cmsStatus.saved
            };

            sitemapStub.upsert.returns(Promise.resolve(true));
            sitemapStub.destroy.returns(Promise.resolve(true));
            controller.processMessage(message.status, message.site, message.content).then(() => {
                expect(sitemapStub.upsert.calledOnce).to.be.false;
                expect(sitemapStub.destroy.calledOnce).to.be.false;
            }).then(done, done);
        });
    });

    describe('getIndex test', () => {
        it('should call findAll', done => {
            const req = {
                params: { site: 'test' }
            };

            sitemapStub.findAll.returns(Promise.resolve());
            controller.getIndex(req, res, next)
                .then(() => {
                    expect(sitemapStub.findAll.calledOnce).to.be.true;
                })
                .then(done, done);
        });
    });

    describe('getSection test', () => {
        it('should call findAll and findOne', done => {
            const req = {
                params: { site: 'test' }
            };
            const baseNode = {
                data : {
                    sitemapRootNodeIds : [ 'TEST-1234' ]
                }
            };

            sitemapStub.findOne.returns(Promise.resolve(baseNode));
            sitemapStub.findAll.returns(Promise.resolve());
            controller.getSection(req, res, next)
                .then(() => {
                    expect(sitemapStub.findOne.calledOnce).to.be.true;
                    expect(sitemapStub.findAll.calledOnce).to.be.true;
                })
                .then(done, done);
        });
    });
});


